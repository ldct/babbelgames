defmodule FrexServer do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/sentenceMatchingGame/sherlock/:episode" do

    "hi" |> IO.inspect

    srtFilename = episode
    |> String.replace(".json", "")
    |> IO.inspect

    episodeFilename = srtFilename |> String.replace(".srt", "")

    entries = Srt.pairSrt(
      "data/subtitles/sherlock/en/" <> srtFilename,
      "data/subtitles/sherlock/fr/" <> srtFilename,
      "data/screenplay/sherlock/" <> episodeFilename <> ".txt")
    |> Enum.map(fn
      {a, b, c} -> [a, b, c]
      {a, b} -> [a, b]
    end)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      entries,
      pretty: true
    ))

  end

  get "/sentenceMatchingGame/:seriesName/:episode" do
    srtFilename = episode
    |> String.replace(".json", "")
    |> IO.inspect

    entries = Srt.pairSrt("data/subtitles/" <> seriesName <> "/en/" <> srtFilename, "data/subtitles/" <> seriesName <> "/fr/" <> srtFilename)
    |> Enum.map(fn
      {a, b, c} -> [a, b, c]
      {a, b} -> [a, b]
    end)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      entries,
      pretty: true
    ))

  end

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