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

  def metadataOf(series, episode) do

    matchingRows = Data.rows
    |> Enum.filter(fn
      %{:series => s, :episode => e} when series === s and episode === e -> true
      _ -> false
    end)

    case matchingRows do
      [row] -> row
      _ -> %{}
    end
  end

  get "/sentenceMatchingGame/:series/:episode" do

    cacheFilename = "cache/" <> series <> "\\" <> episode

    if File.exists?(cacheFilename) do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(200, File.read!(cacheFilename))
    else
      "file not exists" |> IO.inspect

      srtFilename = episode
      |> String.replace(".json", "")
      |> IO.inspect

      episodeFilename = srtFilename |> String.replace(".srt", "")

      entries = Srt.pairSrt(
        "data/subtitles/" <> series <> "/en/" <> srtFilename,
        "data/subtitles/" <> series <> "/fr/" <> srtFilename,
        "data/screenplay/" <> series <> "/" <> episodeFilename <> ".txt")
      |> Enum.map(fn x -> Tuple.to_list(x) end)

      jsonResult = Poison.encode!(%{
        "tileData" => entries,
        "screenplay" => File.read!("data/screenplay/" <> series <> "/" <> episodeFilename <> ".txt"),
        "metadata" => metadataOf(series, episode |> String.replace(".srt.json", "")),
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
