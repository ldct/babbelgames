# Babbelgames 

## Dependencies

babbelgames requires postgres, elixir, node, webpack and babel to build.

### Elixir

Install elixir, make sure the commands `iex` and `mix` work. Then run
```
mix deps.get
```
to install some elixir packages we depend on and
```
iex -S mix
```
to start the application, listening on localhost:4000.

### node+webpack+babel

Install node, webpack and babel. When developing run

```
webpack --watch
```

Once you are ready to commit, run
```
NODE_ENV=production webpack -p
```

and commit the compiled `bundle.min.js` file.

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
