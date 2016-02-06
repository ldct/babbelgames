defmodule FrexApp do
  use Application

  def start(_type, _args) do
    IO.inspect "hello world!"
    Plug.Adapters.Cowboy.http FrexServer, [], port: 4000
  end
end