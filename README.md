# frex-backend
backend for frex (lessons, user management)

## deployment

mix deps.get
iex -S mix
{:ok, _} = Plug.Adapters.Cowboy.http Frex, []