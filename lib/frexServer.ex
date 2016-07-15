defmodule FrexServer do

  use Plug.Router
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison

  plug Ueberauth
  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/episode_pairs.json" do
    contents = BabbelgamesDb.getAllEpisodePairs()
    |> Poison.encode!

    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/auth/facebook/callback" do

    # TODO: generate a proper JWT token

    %Plug.Conn{
      assigns: %{
        ueberauth_auth: %Ueberauth.Auth{
          credentials: %Ueberauth.Auth.Credentials{
            token: token
          },
          info: %Ueberauth.Auth.Info{
            email: email,
            image: image,
            name: name
          }
        }
      }
    } = conn

    IO.inspect({email, image, name})

    BabbelgamesDb.addSession(email, token)
    BabbelgamesDb.addUser(email) # todo: check if user exists and log in

    contents = File.read!("frontend/drop_and_redirect.html")
    |> String.replace("{{userdata}}", Poison.encode!(%{
      "token" => token,
      "email" => email,
      "image_url" => image,
    }))

    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/" do
    contents = File.read!("frontend/index.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> put_resp_header("cache-control", "max-age=60")
    |> send_resp(200, contents)
  end

  get "/page/*glob" do
    contents = File.read!("frontend/index.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> put_resp_header("cache-control", "max-age=60")
    |> send_resp(200, contents)
  end

  # Client reports that a correct match has been made
  post "progress/correctMatch" do

    %Plug.Conn{
      body_params: %{
        "line_number" => lineNumber,
        "tile_idx" => tileIdx,
        "session_token" => sessionToken,
        "episode_md5" => episodeMD5,
      }
    } = conn

    BabbelgamesDb.markCorrectPair(episodeMD5, sessionToken, lineNumber, tileIdx)

    conn|> send_resp(200, "OK")
  end

  get "progress/correctMatch/:episodeMD5" do

    %Plug.Conn{
      query_params: %{
        "session_token" => sessionToken
      }
    } = conn

    IO.inspect(sessionToken)

    res = BabbelgamesDb.getCorrectPairs(episodeMD5, sessionToken)
    |> Poison.encode!(pretty: true)
    |> IO.inspect

    conn
    |> send_resp(200, res)
  end

  get "/sentenceMatchingGame/:uid" do

    # TODO(xuanji): rename to ignoreCache
    editMode = case conn do
      %Plug.Conn{
        query_params: %{
          "editMode" => "1"
        }
      } -> true
      _ -> false
    end

    cacheFilename = "cache/" <> uid
    if not editMode and File.exists?(cacheFilename) do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(200, File.read!(cacheFilename))
    else

      x = uid |> BabbelgamesDb.getEpisodePairDataOf
      {:ok, %{
        "l1_srt_filename" => l1SrtFilename,
        "l2_srt_filename" => l2SrtFilename,
        "l1_screenplay_filename" => l1ScreenplayFilename,
        "episode_poster_filename" => episodePosterFilename,
        "episode_title" => episodeTitle,
        "episode_seqnumber" => episodeSeqnumber,
        "series_name" => seriesName,
        "l2_code" => l2Code,
      }} = x

      # %{"episode_poster_filename" => "friends-s01e01.jpg",
      #   "episode_seqnumber" => "s01e01",
      #   "episode_title" => "The One Where Monica Gets a Roommate", "l1_code" => "en",
      #   "l1_screenplay_filename" => "friends-s01e01.txt",
      #   "l1_srt_filename" => "en-friends-s01e01.srt", "l2_code" => "fr",
      #   "l2_srt_filename" => "fr-friends-s01e01.srt", "series_name" => "Friends",
      #   "uid" => "e1f985b1-f137-4d07-adc9-a014266981f3",
      #   "user_email" => "xuanji@gmail.com"}}


      "x" |> IO.inspect
      x |> IO.inspect

      entries = Srt.pairSrt(
        "data/subtitles/" <> l1SrtFilename,
        "data/subtitles/" <> l2SrtFilename,
        "data/screenplay/" <> l1ScreenplayFilename
      )
      |> Enum.map(fn x -> Tuple.to_list(x) end)


      jsonResult = Poison.encode!(%{
        "tileData" => entries,
        "screenplay" => File.read!("data/screenplay/" <> l1ScreenplayFilename),
        "metadata" => %{
          "title" => episodeTitle,
          "subtitle" => seriesName <> " " <> episodeSeqnumber,
          "poster_filename" => episodePosterFilename,
          "l2_code" => l2Code
        },
      }, pretty: true)

      File.write!(cacheFilename, jsonResult)

      conn
      |> put_resp_content_type("application/json")
      |> send_resp(200, jsonResult)
    end
  end

  def static(conn, contentType, filepath) do
    conn
    |> put_resp_header("cache-control", "max-age=60")
    |> put_resp_content_type(contentType)
    |> send_resp(200, File.read!(filepath))
  end

  get "/js/bundle.min.js" do
    conn
    conn
    |> put_resp_header("cache-control", "max-age=0")
    |> put_resp_content_type("application/javascript")
    |> send_resp(200, File.read!("frontend/js/bundle.min.js"))
  end

  get "/img/:filename" do
    static(conn, "image", "frontend/img/" <> filename)
  end

  get "/js/:filename" do
    static(conn, "application/javascript", "frontend/js/" <> filename)
  end

  get "/css/:filename" do
    static(conn, "text/css", "frontend/css/" <> filename)
  end

  def translateFrenchWord(word) do
    api_key = File.read! "GOOGLE_TRANSLATE_API_KEY"

    url = "https://www.googleapis.com/language/translate/v2?" <> URI.encode_query(%{
      "source" => "fr",
      "target" => "en",
      "key" => api_key,
      "q" => word
    })

    (HTTPotion.get url).body
    |> Poison.decode!
    |> Map.fetch!("data")
    |> Map.fetch!("translations")
    |> List.first
    |> Map.fetch!("translatedText")

  end

  get "translate/:words" do

    translatedWords = words
    |> String.split(",")
    |> Enum.map(fn w -> {w, translateFrenchWord(w)} end)
    |> Enum.into(%{})


    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(translatedWords))
  end

  match _ do
    send_resp(conn, 404, "oops")
  end
end
