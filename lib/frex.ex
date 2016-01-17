defmodule Frex do
  use Plug.Router

  plug :match
  plug :dispatch

  get "/hello" do
    send_resp(conn, 200, "world")
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