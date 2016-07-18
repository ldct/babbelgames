# frex-backend
backend for frex (lessons, user management)

## Webpack

Run this

```
NODE_ENV=production webpack
```

## deployment

Open command prompt and cd to your frex-backend and run
```
mix deps.get
```

After all the dependencies are installed run
```
iex -S mix
```
The application should now be running on `http://localhost:4000/`


## installation for windows

Clone the respository by running

```
git clone https://github.com/zodiac/frex-backend.git
```
Install elixir using the installer for windows (it will install erlang if you do not have it)
http://elixir-lang.org/install.html

Add git.exe to the environment variable PATH which is found at
C:\Users\<user>\AppData\Local\GitHub\PortableGit_<number>\cmd

## fixing screwed up files

bbe -e "s/\xe9/é/g" s01e01.srt > s01e01.fixed.srt

## postgres on OSX

To start the server,

```
postgres -D /usr/local/var/postgres
```

To start the client,

```
psql -d babbelgames
```

If no babbelgames database exists, use `psql -d postgres` and create it
