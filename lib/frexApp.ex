defmodule FrexApp do
  use Application

  def start(_type, _args) do
    {:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
    Plug.Adapters.Cowboy.http(FrexServer, [], port: getPort)
  end

  def getPort do
    4000
  end

end