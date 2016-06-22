defmodule BabbelgamesDb do
	def initDb() do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, "CREATE TABLE IF NOT EXISTS users(uid TEXT, email TEXT)", [])
		Postgrex.query!(pid, "CREATE TABLE IF NOT EXISTS sessions(secret TEXT, user_email TEXT)", [])
	end

	def addSession(user_email, secret) do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, "INSERT INTO SESSIONS (user_email, secret) VALUES ($1, $2)", [user_email, secret])
	end

	def addUser(email) do
		uid = UUID.uuid4()
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, "INSERT INTO users (uid, email) VALUES ($1, $2)", [uid, email])
	end
end