import { useState, useEffect } from "react"
import axios from "axios"
import { Toast } from "bootstrap"
import { Modal } from "bootstrap"

export default function Pelanggaran() {
    let [pelanggaran, setPelanggaran] = useState([])
    let [message, setMessage] = useState("")

    let [idPelanggaran, setIdPelanggaran] = useState (0)
    let [namaPelanggaran, setNamaPelanggaran] = useState("")
    let [poin, setPoin] = useState (0)
    let [action, setAction] = useState ("")

    let [modal, setModal] = useState (null)

    /** get token from local storage */
    let token = localStorage.getItem(`token-pelanggaran`)

    let authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    /** create function to show Toast */
    let showToast = message => {
        let myToast = new Toast(
            document.getElementById(`myToast`),
            {
                autohide: true
            }
        )
        /** perintah untuk mengisi state 'message' */
        setMessage(message)

        /** show toast */
        myToast.show()
    }

    /** create function to get data pelanggaran from backend */
    let getData = () => {
        /**
         * endpoint = http://localhost:8080/pelanggaran 
         * method = GET
         * request = none
         * response = array data pelanggaran
         * authorization = Bearer token
         */
        let endpoint = `http://localhost:8080/pelanggaran`
        /** sending data */
        axios.get(endpoint, authorization)
            .then(response => {
                /** simpan di state pelanggaran */
                setPelanggaran(response.data)

                /** call showToast */
                showToast(`Data pelanggaran berhasil dimuat`)
            })
            .catch(error => console.log(error))
    }

    let addData = () => {
        /** display modal */
        modal.show()

        /** mengosongkan inputan formnya */
        setIdPelanggaran(0)
        setNamaPelanggaran("")
        setPoin(0)
        setAction('insert')
    }

    let editData = item => {
        /** display modal */
        modal.show()

        /** isi form sesuai data yg dipilih */
        setIdPelanggaran(item.id_pelanggaran)
        setNamaPelanggaran(item.nama_pelanggaran)
        setPoin(item.poin)
        setAction(`edit`)
    }

    let saveData = event => {
        event.preventDefault()
        /** close modal */
        modal.hide()
        if (action === "insert") {
            let endpoint = `http://localhost:8080/pelanggaran`
            let request = {
                nama_pelanggaran: namaPelanggaran,
                poin: poin
            }

            /** send data */
            axios.post(endpoint, request, authorization)
            .then(response => {
                showToast(response.data.message)
                /** refresh data pelanggaran */
                getData()
            })
            .catch(error => console.log(error))
        } else if (action === "edit") {
            
        }
    }

    useEffect(() => {
        let modal = new Modal(
            document.getElementById("modalPelanggaran")
        )
        setModal(modal)
        getData()
    }, [])

    return (
        <div className="container-fluid">

            {/** start component Toast */}
            <div className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: 11 }}>
                <div className="toast bg-light" id="myToast">
                    <div className="toast-header bg-dark text-white">
                        <strong>Message</strong>
                    </div>
                    <div className="toast-body">
                        {message}
                    </div>
                </div>
            </div>
            {/** end component Toast */}

            <div className="card m-2">
                <div className="card-header"
                    style={{ background: `purple` }} align="center">
                    <h4 className="text-white">
                        Daftar Jenis Pelanggaran
                    </h4>
                </div>

                <div className="card-body">
                    <ul className="list-group">
                        {pelanggaran.map(item => (
                            <li className="list-group-item">
                                <div className="row">
                                    <div className="col-2">
                                        <small className="text-info">
                                            ID Pelanggaran
                                        </small>
                                        <h5>{item.id_pelanggaran}</h5>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-info">
                                            Jenis Pelanggaran
                                        </small>
                                        <h5>{item.nama_pelanggaran}</h5>
                                    </div>
                                    <div className="col-2">
                                        <small className="text-info">
                                            Poin
                                        </small>
                                        <h5>{item.poin}</h5>
                                    </div>
                                    <div className="col-2">
                                        <small className="text-info">
                                            Option
                                        </small>
                                        <br />
                                        <button className="btn btn-sm btn-info mx-1"
                                        onClick={() => editData(item)}>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                        <button className="btn btn-sm btn-danger mx-1">
                                            <span className="fa fa-trash"></span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/** button tambah */}
                    <button className="btn btn-sm btn-dark my-2"
                    onClick={() => addData()}>
                        <span className="fa fa-plus"></span> Add Data
                    </button>

                    {/** buat modal yg isinya form untuk data pelanggaran */}
                    <div className="modal" id="modalPelanggaran">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-info">
                                    <h4 className="text-white">
                                        Form Pelanggaran
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => saveData(ev)}>
                                        Jenis Pelanggaran
                                        <input 
                                            type="text"
                                            className="form-control mb-2"
                                            required
                                            onChange={e => setNamaPelanggaran(e.target.value)}
                                            value={namaPelanggaran} />

                                        Poin
                                        <input 
                                            type="number"
                                            className="form-control mb-2"
                                            required 
                                            onChange={e => setPoin(e.target.value)}
                                            value={poin}/>

                                        <button className="btn btn-success" type="submit">
                                            <span className="fa fa-check"></span> Save
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}