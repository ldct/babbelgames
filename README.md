# frex-backend
backend for frex (lessons, user management)

## deployment

mix deps.get
iex -S mix
{:ok, _} = Plug.Adapters.Cowboy.http Frex, [], port: 4000

## stats

after filtering out stubs, etc: 35958 (19017 unique)
after filtering out sentences that don't contain est: 15117 unique

## weird things in the stanford parser

"ne résoudrait pas" is parsed as "ne résoudrait"/VN + "pas"/ADV

## known bugs

parser cannot parse punctuation
