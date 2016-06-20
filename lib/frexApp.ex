defmodule FrexApp do
  use Application

  def start(_type, _args) do
    BabbelgamesDb.initDb()
    Plug.Adapters.Cowboy.http(FrexServer, [], port: getPort)
  end

  def getPort do
    4000
  end

end