# frex-backend
backend for frex (lessons, user management)

## path to MVP

- [ ] explore using constituent parses to make sentences simpler
  - [ ] run stanford parser
  - [ ] tokenize stanford parser output
  - [ ] parse stanford parser output
  - [ ] visualize stanford parser output (optional)
  - [ ] chunk sentence
- [ ] provide hints
  - [ ] lookup all chunks/words in a dictionary

## deployment

mix deps.get
iex -S mix
{:ok, _} = Plug.Adapters.Cowboy.http Frex, [], port: 4000

## stats

after filtering out stubs, etc: 35958 (19017 unique)
after filtering out sentences that don't contain est: 15117 unique
