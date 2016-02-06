defmodule FrexServer do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/progress" do
    list_translated = File.ls!("vikidia/translated")

    l = list_translated 
    |> length
    |> Integer.to_string

    lst = list_translated
    |> Enum.sort
    |> List.last

    send_resp(conn, 200, l <> "\n" <> lst)
  end

  get "/sentence/__random.json" do

    contents = getShortSentence(10)
    |> Poison.encode!

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, contents)

  end

  get "/sentence/random.json" do
    
    :random.seed(:os.timestamp)
    res = VikidiaSentenceCache.get()
    |> Enum.random
    |> Poison.encode!
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, res)

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