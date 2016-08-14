defmodule FrexApp do
  use Application

  def start(_type, _args) do
    DbWrapper.start_link(nil)
    BabbelgamesDb.initDb()
    Plug.Adapters.Cowboy.http(FrexServer, [], port: getPort)
  end

  def getPort do
    4000
  end

end