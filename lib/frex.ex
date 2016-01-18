defmodule Frex do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
  end

  get "/sentence/random.json" do
    api_key = File.read! "GOOGLE_TRANSLATE_API_KEY"
    sentence = "Merci de te joindre à nous ce matin."
    url = "https://www.googleapis.com/language/translate/v2?q=Merci+de+te+joindre+%C3%A0+nous+ce+matin.&target=en&source=fr&key=" <> api_key

    response = HTTPotion.get url    
    body = Poison.decode! response.body
    trans = body["data"]["translations"] |> List.first
    tt = trans["translatedText"]
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(%{
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