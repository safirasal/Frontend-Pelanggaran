import { useState } from "react"
import axios from "axios"
/**
 * axios digunakan untuk proses transfer data dari frontend
 * ke backend
 */
export default function Login() {
    /** define to state username adn password */
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")

    let loginProcess = ev => {
        ev.preventDefault()
        /** akses ke backend utk proses login */
        /** method: post
         * endpoint: http://localhost:8080/user/auth
         * request: username and password
         * response: logged and token
         */
        let request = {
            username: username,
            password: password
        }
        let endpoint = `http://localhost:8080/user/auth`

        /** sending data */
        axios.post(endpoint, request)
            .then(response => {
                if (response.data.logged === true) {
                    let token = response.data.token
                    /** store toke to local storage browser */
                    localStorage.setItem(`token-pelanggaran`, token)
                    alert(`Login Success`)
                } else {
                    alert(response.data.message)
                }
            })
            .catch(error => {
                console.log(error)
            })


    }

    return (
        <div className="container">
            <div className="card col-lg-6 mx-auto">
                <div className="card-header" align="center" style={{ background: `indigo` }}>
                    <h4 className="text-white">
                        Sign In
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={ev => loginProcess(ev)}>
                        <h5>Username</h5>
                        <input type={`text`} className="form-control mb-2"
                            required
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)} />

                        <h5>Password</h5>
                        <input type={`password`} className="form-control mb-2"
                            required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)} />

                        <button type="submit" className="btn btn-dark">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}