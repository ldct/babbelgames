defmodule FrexServer do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/sentence/all/:start/:stop" do
    start = String.to_integer(start)
    stop = String.to_integer(stop)
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      VikidiaSentenceCache.get() |> Enum.slice(start..stop),
      pretty: true
    ))
  end

  get "/sentence/random.json" do
    :random.seed(:os.timestamp)

    res = VikidiaSentenceCache.get()
    |> Enum.random
    |> Poison.encode!(pretty: true)
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, res)

  end

  get "/sentenceMatchingGame/random.json" do
    :random.seed(:os.timestamp)

    entries = Srt.pairSrt("friends/en/s01e01.srt", "friends/fr/s01e01.srt")

    idx = randomIndex(entries)

    randomSlice = entries
    |> Enum.slice(idx, 5)
    |> Enum.map(fn {a, b} -> [a, b] end)
    |> IO.inspect

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      randomSlice,
      pretty: true
    ))
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

  def randomIndex(arr) do
    :rand.uniform * (length(arr) - 1) |> round
  end

  def randomIndex do
    :rand.uniform * 100000 |> round
  end


  get "/index.html" do
    contents = File.read!("static/index.html")
    conn
    |> put_resp_content_type("text/html; charset=UTF-8")
    |> send_resp(200, contents)
  end

  get "/matchingGame.html" do
    contents = File.read!("static/matchingGame.html")
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

  get "/matchingGameOrdered.jsx" do
    contents = File.read!("matchingGameOrdered.jsx")
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

  get "subtitle/random.json" do

    fr = File.stream!("opus-OS/en-fr/fr")
    en = File.stream!("opus-OS/en-fr/en")
    fp = File.stream!("pcfg-done/fr.aa.stp")
    n = randomIndex()

    frSentence = fr |> Enum.at(n) |> String.replace("\n", "") |> String.replace(~r/^- /, "")
    enSentence = en |> Enum.at(n) |> String.replace("\n", "") |> String.replace(~r/^- /, "")
    {:ok, ["ROOT", frParsed]}  = fp
    |> Enum.at(n)
    |> String.replace("PUNC \"", "PUNC DOUBLEQUOTE")
    |> SymbolicExpression.Parser.parse

    frParsed |> IO.inspect

    frContext = fr |> Enum.slice(n-3, 6)
    enContext = en |> Enum.slice(n-3, 6)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(
      %{
        'original': frSentence,
        'context': %{
          'original': frContext,
          'translated': enContext
        },
        'constituents': frParsed |> Nlp.extractChunkedConstituentsTree,
        # 'parsed': frParsed,
        '_n': n,
        # 'awrScore': frSentence |> Nlp.averageWordRankScore,
        # 'hwrScore': frSentence |> Nlp.highestWordRankScore,
        'swrScore': frSentence |> Nlp.sumWordRankScore,
        'translated': enSentence,
      },
      pretty: true
    ))

  end

  get "/sentence/sorted-by-length/:start/:stop" do
    start = String.to_integer(start)
    stop = String.to_integer(stop)

    res = VikidiaSentenceCache.get()
    |> Enum.map(fn s -> s["original"] end)
    |> IO.inspect
    |> Enum.sort_by(&String.length/1)
    |> Enum.slice(start..stop)
    |> Poison.encode!(pretty: true)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, res)
  end

  get "/sentence/__random.json" do

    contents = getShortSentence(10)
    |> Poison.encode!

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, contents)

  end

  get "/_progress" do
    list_translated = File.ls!("vikidia/translated")

    l = list_translated
    |> length
    |> Integer.to_string

    lst = list_translated
    |> Enum.sort
    |> List.last

    send_resp(conn, 200, l <> "\n" <> lst)
  end

  def getShortSentence(max_length) do

    filename = File.ls!("vikidia/translated")
    |> Enum.random

    json = File.read!("vikidia/translated/" <> filename)
    |> Poison.decode!

    len = json
    |> Map.fetch!("original")
    |> String.split
    |> length

    if len <= max_length do
      json
    else
      getShortSentence(max_length)
    end

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

  get "/sentence/_random.json" do
    api_key = File.read! "GOOGLE_TRANSLATE_API_KEY"

    hasard = "https://fr.vikidia.org/wiki/Sp%C3%A9cial:Page_au_hasard"
    h_resp = HTTPotion.get hasard
    {:Location, loc} = List.keyfind(h_resp.headers, :Location, 0)

    pocket_endpoint = "http://text.readitlater.com/v3beta/text"
    pocket_url = pocket_endpoint <> "?" <> URI.encode_query(%{
      "images" => 0,
      "output" => "json",
      "msg" => 1,
      "url" => loc
    })

    response = HTTPotion.get pocket_url

    sentence = response.body
    |> Poison.decode!
    |> Map.fetch!("excerpt")
    |> String.split(".")
    |> List.first

    sentence = sentence <> "."

    IO.inspect sentence

    url = "https://www.googleapis.com/language/translate/v2?" <> URI.encode_query(%{
      "target" => "en",
      "source" => "fr",
      "key" => api_key,
      "q" => sentence
    })
    body = Poison.decode! ((HTTPotion.get url).body)

    IO.inspect body

    tt = body
    |> Map.fetch!("data")
    |> Map.fetch!("translations")
    |> List.first
    |> Map.fetch!("translatedText")

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(%{
      loc: loc,
      original: sentence,
      translated: tt
    }))
  end

  get "/lists/1.json" do
  	{:ok, wk1} = File.read "week1.json"
  	conn
  	|> put_resp_content_type("application/json")
  	|> send_resp(200, wk1)
  end

  get "/lists/2.json" do
  	{:ok, wk2} = File.read "week2.json"
  	conn
  	|> put_resp_content_type("application/json")
  	|> send_resp(200, wk2)
  end

  # get "/json/:name" do
  #   conn
  #   |> put_resp_content_type("application/json")
  #   |> send_resp(200, Poison.encode!(%{name: name}))
  # end

  # forward "/users", to: UsersRouter

  match _ do
    send_resp(conn, 404, "oops")
  end
end