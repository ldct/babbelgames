defmodule FrexServer do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/sentenceMatchingGame/friends.s01e01.srt.json" do

    entries = Srt.pairSrt("friends/en/s01e01.srt", "friends/fr/s01e01.srt")
    |> Enum.map(fn {a, b} -> [a, b] end)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      entries,
      pretty: true
    ))
  end

  get "/sentenceMatchingGame/friends.s01e02.srt.json" do

    entries = Srt.pairSrt("friends/en/s01e02.srt", "friends/fr/s01e02.srt")
    |> Enum.map(fn {a, b} -> [a, b] end)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      entries,
      pretty: true
    ))
  end

  get "/sentenceMatchingGame/sherlock.s01e01.srt.json" do

    entries = Srt.pairSrt("sherlock/en/s01e01.srt", "sherlock/fr/s01e01.srt")
    |> Enum.map(fn {a, b} -> [a, b] end)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      entries,
      pretty: true
    ))
  end

  get "/sentenceMatchingGame/sherlock.s01e02.srt.json" do

    entries = Srt.pairSrt("sherlock/en/s01e02.srt", "sherlock/fr/s01e02.srt")
    |> Enum.map(fn {a, b} -> [a, b] end)

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
    contents = File.read!("static/matchingGame.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/index.html" do
    contents = File.read!("static/index.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/matchingGameOrdered.html" do
    contents = File.read!("static/matchingGameOrdered.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/img/:filename" do
    contents = File.read!("static/img/" <> filename)
    conn
    |> send_resp(200, contents)
  end

  get "/matchingGameOrdered.jsx" do
    contents = File.read!("static/matchingGameOrdered.jsx")
    conn
    |> put_resp_content_type("application/javascript; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/bundle.js" do
    contents = File.read!("static/bundle.js")
    conn
    |> put_resp_content_type("application/javascript; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/matchingBundle.js" do
    contents = File.read!("static/matchingBundle.js")
    conn
    |> put_resp_content_type("application/javascript; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "subtitle-noparse/random.json" do
    fr = File.stream!("opus-OS/en-fr/fr")
    en = File.stream!("opus-OS/en-fr/en")
    n = randomIndex()

    frSentence = fr |> Enum.at(n) |> String.replace("\n", "") |> String.replace(~r/^- /, "")
    enSentence = en |> Enum.at(n) |> String.replace("\n", "") |> String.replace(~r/^- /, "")

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      %{
        'original': frSentence,
        'translated': enSentence,
      },
      pretty: true
    ))
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