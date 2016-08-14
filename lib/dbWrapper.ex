defmodule DbWrapper do
    use GenServer

    # Thanks http://stackoverflow.com/questions/37009942/where-do-i-store-the-pid-for-longrunning-child-processes

    # External API

    def start_link(state) do
        GenServer.start_link( __MODULE__, state, name: __MODULE__ )
    end

    def query!(statement, args) do
        GenServer.call __MODULE__, { :query!, statement, args }
    end

    # GenServer implementation

    def init(state) do
        {:ok, pid} = Postgrex.start_link(hostname: "localhost", username: "postgres", database: "babbelgames")

        # pid becomes state available in handle_call / terminate
        {:ok, pid}
    end

    def handle_call({ :query!, statement, args }, _, pid) do
        r = Postgrex.query!( pid, statement, args )
        { :reply, r, pid }
    end

end
