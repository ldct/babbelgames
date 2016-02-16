defmodule FrexApp do
  use Application

  def start(_type, _args) do
    IO.inspect "hello world!"
    {:ok, _} = VikidiaSentenceCache.start_link
    Plug.Adapters.Cowboy.http(FrexServer, [], port: getPort)
    |> IO.inspect
  end

  def getPort do
    4000
  end

end