defmodule FrexApp do
  use Application

  def start(_type, _args) do
    IO.inspect "hello world!"
    {:ok, _} = VikidiaSentenceCache.start_link
    Plug.Adapters.Cowboy.http FrexServer, [], port: getPort
  end

  def getPort do
    if Mix.env == :prod do
      80
    else
      4000
    end
  end

end