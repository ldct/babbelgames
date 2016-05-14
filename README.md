# frex-backend
backend for frex (lessons, user management)

## install

wget http://nlp.stanford.edu/software/stanford-parser-full-2015-12-09.zip
unzip stanford*.zip
rm stanford*.zip
mv stanford* stanford-parser
rsync -avzPe "ssh -i ./xuanji-OSX.pem" ./opus-OS/en-fr/fr ubuntu@54.201.205.125:/home/ubuntu/fr
ln -s ../lexparser_xj.sh lexparser_xj.sh
mkdir opus-OS

## deployment

```
mix deps.get
iex -S mix
# {:ok, _} = Plug.Adapters.Cowboy.http Frex, [], port: 4000
```

## fixing screwed up files

bbe -e "s/\xe9/é/g" s01e01.srt > s01e01.fixed.srt

## stats for vikidia

after filtering out stubs, etc: 35958 (19017 unique)
after filtering out sentences that don't contain est: 15117 unique

## weird things in the stanford parser

"ne résoudrait pas" is parsed as "ne résoudrait"/VN + "pas"/ADV

## known bugs

parser cannot parse punctuation


