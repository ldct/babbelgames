defmodule FrexServer do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  def metadataOf(series, episode) do
    case {series, episode} do
      {"friends", "s01e01"} -> %{
        "title" => "The One Where Monica Gets a Roommate",
        "subtitle" => "Friends s01e01"
      }
      {"sherlock", "s01e01"} -> %{
        "title" => "A Study in Pink",
        "subtitle" => "Sherlock s01e01"
      }
      {"sherlock", "s01e02"} -> %{
        "title" => "The Blind Banker",
        "subtitle" => "Sherlock s01e02"
      }
      _ -> %{}
    end
  end

  get "/sentenceMatchingGame/:series/:episode" do

    cacheFilename = "cache/" <> series <> "\\" <> episode

    if false && File.exists?(cacheFilename) do
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

  # get "/sentenceMatchingGame/:seriesName/:episode" do
  #   srtFilename = episode
  #   |> String.replace(".json", "")
  #   |> IO.inspect

  #   entries = Srt.pairSrt("data/subtitles/" <> seriesName <> "/en/" <> srtFilename, "data/subtitles/" <> seriesName <> "/fr/" <> srtFilename)
  #   |> Enum.map(fn t -> Tuple.to_list(t) end)


  #   jsonResult = Poison.encode!(%{
  #     "tileData" => entries,
  #   }, pretty: true)

  #   conn
  #   |> put_resp_content_type("application/json")
  #   |> send_resp(200, jsonResult)

  # end

  def randomIndex(arr) do
    :rand.uniform * (length(arr) - 1) |> round
  end

  def randomIndex do
    :rand.uniform * 100000 |> round
  end

  get "/matchingGame.html" do
    contents = File.read!("frontend/matchingGame.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/index.html" do
    contents = File.read!("frontend/index.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/matchingGameOrdered.html" do
    contents = File.read!("frontend/matchingGameOrdered.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/img/:filename" do
    contents = File.read!("frontend/img/" <> filename)
    conn
    |> send_resp(200, contents)
  end

  get "/matchingGameOrdered.jsx" do
    contents = File.read!("frontend/matchingGameOrdered.jsx")
    conn
    |> put_resp_content_type("application/javascript; charset=UTF-8")
    |> send_resp(200, contents)
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