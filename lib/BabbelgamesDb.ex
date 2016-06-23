defmodule BabbelgamesDb do
	def initDb() do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			CREATE TABLE IF NOT EXISTS users (
				uid TEXT,
				user_email TEXT,
				constraint pk_users_user_email primary key (user_email)
			)
		""", [])
		Postgrex.query!(pid, """
			CREATE TABLE IF NOT EXISTS sessions (
				secret TEXT,
				user_email TEXT,
				constraint pk_sessions_user_email primary key (user_email)
			)
		""", [])
	end

	def addSession(user_email, secret) do
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			INSERT INTO SESSIONS (user_email, secret) VALUES ($1, $2)
			ON CONFLICT ON CONSTRAINT pk_sessions_user_email DO UPDATE SET secret=$2
		""", [user_email, secret])
	end

	def addUser(email) do
		uid = UUID.uuid4()
		{:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")
		Postgrex.query!(pid, """
			INSERT INTO users (uid, user_email) VALUES ($1, $2) ON CONFLICT DO NOTHING
		""", [uid, email])
	end
end