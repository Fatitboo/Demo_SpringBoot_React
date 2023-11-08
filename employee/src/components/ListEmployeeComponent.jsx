import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { MdFileOpen } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
function ListEmployeeComponent() {
    const [employees, setEmployees] = useState([]);
    const [addEmployee, setAddEmployee] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [img, setImg] = useState(null)
    const [ttlSalary, setTotalSalary] = useState(0)
    const [data, setData] = useState({
        id: '',
        avatar: '',
        name: '',
        dob: '',
        phone: '',
        email: '',
        role: 'tester',
        baseSalary: 0,
        numOfOvtHours: 0,
        numOfErrors: 0

    })
    const formAdd = useRef();
    const formEdit = useRef();
    const [errInput, setErrInput] = useState({
        file: '',
        name: '',
        phone: '',
        dob: '',
        email: '',
        baseSalary: '',
        role: '',
        numOfOvtHours: '',
        numOfErrors: '',
        isCheck: false
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };
    useEffect(() => {
        (async () => await Load())();

    }, []);

    async function Load() {
        const result = new Promise((resolve) => {
            const rs = axios.get(
                "http://localhost:8088/api/employees");
            resolve(rs)
        })
        result
            .then(result => { setEmployees(result.data.employees); return result.data.employees; })
            .then((result) => { calculateTotal(result) })

    }
    function calculateTotal(e) {
        var tt = 0
        e.map((item) =>
            tt += item.role === 'coder' ? (parseInt(item.baseSalary) + 200000 * parseInt(item.numOfOvtHours)) : (parseInt(item.baseSalary) + 50000 * parseInt(item.numOfErrors))
        )
        setTotalSalary(tt)
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImg(file)

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData({ ...data, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRule = {
        'required': (value) => {
            return value !== '' ? '' : "Please fill out this field!"
        },
        'imgRequired': () => {

        }

    }
    const handleAdd = async (e) => {
        e.preventDefault();
        const nodeList = formAdd.current.querySelectorAll('input')

        const arrayFromNodeList = Array.from(nodeList);
        arrayFromNodeList.forEach(item => {
            const rules = item.getAttribute('rules')
            if (rules) {

                const ruleArr = rules.split('|');
                for (var rule of ruleArr) {
                    if (rule) {
                        const ruleFunc = handleRule[rule]
                        const rs = ruleFunc(item.getAttribute('value'))
                        console.log(item.getAttribute('name'), rs)

                        setErrInput(prev => {
                            const obj = { ...prev };
                            obj[item.getAttribute('name')] = rs
                            return obj
                        })
                    }
                }
            }
        })
        if (typeof (formAdd.current.file.files[0]) === 'undefined') {
            setErrInput(prev => {
                const obj = { ...prev };
                obj.file = 'Avatar employee is required!'
                return obj
            })


        } else {
            setErrInput(prev => {
                const obj = { ...prev };
                obj.file = ''
                obj.isCheck = true
                return obj
            })
        }
        if (errInput.name === '' && errInput.file === '' && errInput.dob === '' && errInput.phone === '' && errInput.email === '' && errInput.isCheck) {

            const formData = new FormData();
            formData.append('file', img);
            formData.append('avatar', "");
            formData.append('name', data.name);
            formData.append('dob', data.dob);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('baseSalary', data.baseSalary);
            formData.append('numOfOvtHours', data.numOfOvtHours);
            formData.append('numOfErrors', data.numOfErrors);
            console.log(data)
            console.log(formData)
            try {
                const response = await axios.post('http://localhost:8088/api/employees/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'charset': 'utf-8'
                    },
                });
                console.log('Response:', response.data);
                toast(response.data.message)
            } catch (error) {
                console.error('Error:', error);
            }
            setAddEmployee(false)
            setErrInput({
                file: '',
                name: '',
                phone: '',
                dob: '',
                email: '',
                baseSalary: '',
                role: '',
                numOfOvtHours: '',
                numOfErrors: '',
                isCheck: false
            })
            setData({
                avatar: '',
                name: '',
                dob: '',
                phone: '',
                email: '',
                role: 'tester',
                baseSalary: 0,
                numOfOvtHours: 0,
                numOfErrors: 0
            })
            setImg(null)
            Load();
        }

    }
    const handleDelete = async (item) => {
        try {
            await axios.delete(
                "http://localhost:8088/api/employees/delete/" + item.employeeId);
            toast("Delete employee successfully.")
            Load()
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const handleOpenEdit = (item) => {
        setData({
            id: item.employeeId,
            avatar: item.avatar,
            name: item.name,
            dob: item.dob,
            phone: item.phone,
            email: item.email,
            role: item.role,
            baseSalary: item.baseSalary,
            numOfOvtHours: item.numOfOvtHours,
            numOfErrors: item.numOfErrors
        })
        setIsUpdate(true)
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        const err ={
            file: '',
            name: '',
            phone: '',
            dob: '',
            email: '',
            baseSalary: '',
            role: '',
            numOfOvtHours: '',
            numOfErrors: '',
            isCheck: false
        }
        const nodeList = formEdit.current.querySelectorAll('input')

        const arrayFromNodeList = Array.from(nodeList);
        arrayFromNodeList.forEach(item => {
            const rules = item.getAttribute('rules')
            if (rules) {

                const ruleArr = rules.split('|');
                for (var rule of ruleArr) {
                    if (rule) {
                        const ruleFunc = handleRule[rule]
                        const rs = ruleFunc(item.getAttribute('value'))
                        console.log(item.getAttribute('name'), rs)
                        err[item.getAttribute('name')]=rs
                        setErrInput(prev => {
                            const obj = { ...prev };
                            obj[item.getAttribute('name')] = rs
                            return obj
                        })
                    }
                }

            }
        })

        if (err.name === '' && err.file === '' && err.dob === '' && err.phone === '' && err.email === '' ) {

            const formData = new FormData();
            console.log(img)
            formData.append('file', img);
            formData.append('avatar', data.avatar);
            formData.append('name', data.name);
            formData.append('dob', data.dob);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('role', data.role);
            formData.append('baseSalary', data.baseSalary);
            formData.append('numOfOvtHours', data.numOfOvtHours);
            formData.append('numOfErrors', data.numOfErrors);
            console.log('http://localhost:8088/api/employees/update/' + data.id)
            try {
                const response = await axios.post('http://localhost:8088/api/employees/update/' + data.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'charset': 'utf-8'
                    },
                });
                console.log('Response:', response.data);
                toast(response.data.message)
            } catch (error) {
                console.error('Error:', error);
            }
            setIsUpdate(false)
            setErrInput({
                file: '',
                name: '',
                phone: '',
                dob: '',
                email: '',
                baseSalary: '',
                role: '',
                numOfOvtHours: '',
                numOfErrors: '',
                isCheck: false
            })
            setData({
                avatar: '',
                name: '',
                dob: '',
                phone: '',
                email: '',
                role: 'tester',
                baseSalary: 0,
                numOfOvtHours: 0,
                numOfErrors: 0
            })
            Load();
        }
    }
    const handleDobToString = (dob) => {


        // Tạo đối tượng Date từ chuỗi
        const originalDate = new Date(dob);

        // Lấy ngày, tháng và năm
        const day = originalDate.getDate().toString().padStart(2, '0');
        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
        const year = originalDate.getFullYear();

        // Tạo chuỗi định dạng mới
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate
    }
    const parseToVND = (salary) => {
        const formattedNumberString = Number(salary).toLocaleString();
        return `${formattedNumberString} VND`
    }

    return (
        <div>
            <h1 className="text-center mt-4 " style={{ fontSize: '49px' }}>Employee List</h1>
            <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                <button className="btn btn-primary mt-4 mb-4" onClick={() => {
                    setAddEmployee(true); setData({
                        avatar: '',
                        name: '',
                        dob: '',
                        phone: '',
                        email: '',
                        role: 'tester',
                        baseSalary: 0,
                        numOfOvtHours: 0,
                        numOfErrors: 0
                    })
                }}>Add Employee</button>

                <div className="d-flex " style={{ alignItems: 'center' }} >Total Salary: <span>{parseToVND(ttlSalary)}</span></div>
            </div>
            <div className="row">
                <table className="table  table-bordered  fw-normal" >
                    <thead className="table-light">
                        <tr >
                            <th>Id</th>
                            <th >Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Base salary</th>
                            <th>Over Times/ <br />
                                Errors Num</th>
                            <th>Total salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="fw-normal">
                        {
                            employees.map((item, index) => {
                                return (
                                    <tr key={index} className="fw-normal">
                                        <th className="fw-normal">NV{index + 1}</th>
                                        <th >
                                            <div className="d-flex">
                                                <div style={{ marginRight: '10px' }}>
                                                    <img src={`http://localhost:8088/api/employees/images/${item.avatar}`} alt="avt" style={{ width: '80px', height: '80px' }} />
                                                </div>
                                                <div className="fw-normal">
                                                    <div><strong>Name:</strong> {item.name}</div>
                                                    <div><strong>Dob:</strong> {handleDobToString(item.dob)}</div>
                                                    <div><strong>Phone:</strong> {item.phone}</div>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="fw-normal">{item.role === 'coder' ? 'Coder' : "Tester"}</th>
                                        <th className="fw-normal">{item.email}</th>
                                        <th className="fw-normal">{parseToVND(item.baseSalary)}</th>
                                        <th className="fw-normal">{item.role === 'coder' ? item.numOfOvtHours : item.numOfErrors}</th>
                                        <th className="fw-normal">{parseToVND(item.role === 'coder' ? (parseInt(item.baseSalary) + 200000 * parseInt(item.numOfOvtHours)).toString() : (parseInt(item.baseSalary) + 50000 * parseInt(item.numOfErrors)).toString())}</th>
                                        <th>
                                            <div className="d-flex mr-0">
                                                <button className="btn btn-primary " onClick={() => handleOpenEdit(item)} style={{ marginRight: '12px' }} >Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(item)} >Delete</button>
                                            </div>
                                        </th>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            <Modal visible={addEmployee} setModal={setAddEmployee}>
                <div className="container " style={{ width: '45vw', height: 'fit-content', backgroundColor: 'white', padding: '20px' }}>
                    <h2 className="text-center">Add Employee </h2>
                    <div className="container mt-4 " style={{ width: '100%' }}>
                        <form ref={formAdd}>
                            <div className="form-group d-flex " >
                                <div style={{ width: '260px', height: '260px', border: '1px solid #ccc', marginRight: '16px' }}>
                                    <img src={data.avatar} alt="avt" style={{ width: '258px', height: '258px', border: '1px solid #ccc' }} />
                                    {errInput.file && <p style={{ color: 'red', fontSize: '14px', marginTop:'2px' }}>{errInput.file}</p>}
                                </div>
                                <div style={{ display: 'flex', marginRight: '60px', marginLeft: '10px', flexDirection:'column-reverse' }}>
                                    <label htmlFor="file" style={{ backgroundColor: 'rgb(87, 243, 69)', height: '30px', width: '30px', borderRadius: '12px', color: 'black', alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><MdFileOpen /></label>
                                    <input type="file" style={{ display: 'none' }} rules='imgRequired' id="file" name="file" onChange={handleImageChange}></input>
                                </div>

                                <div className="form-group w-75 " >
                                    <label>Employee Name</label>
                                    <input type="text" name="name" className="form-control"
                                        value={data.name} rules="required"
                                        onChange={handleChange} />

                                    {errInput.name && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.name}</p>}
                                    <label>Phone</label>
                                    <input type="text" name="phone" className="form-control"
                                        value={data.phone} rules="required"
                                        onChange={handleChange} />
                                    {errInput.phone && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.phone}</p>}
                                    <label>Dob</label>
                                    <input type="datetime-local" name="dob" className="form-control"
                                        value={data.dob} rules="required"
                                        onChange={handleChange} />
                                    {errInput.dob && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.dob}</p>}
                                </div>

                            </div>
                            <div className="form-group d-flex mt-4">
                                <div className="w-50 " style={{ marginRight: '20px' }}>
                                    <label>Email</label>
                                    <input type="email" name="email" className="form-control"
                                        value={data.email} rules="required"
                                        onChange={handleChange}
                                    />
                                    {errInput.email && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.email}</p>}
                                </div>
                                <div className="w-50">
                                    <label>Base salary</label>
                                    <input type="number" name="baseSalary" className="form-control"
                                        value={data.baseSalary} rules="required"
                                        onChange={handleChange}
                                    />
                                    {errInput.baseSalary && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.baseSalary}</p>}

                                </div>
                            </div>

                            <div className="form-group d-flex mt-4">
                                <div className="w-50 " style={{ marginRight: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <label>Role</label>
                                    <select value={data.role} className="form-select" name="role" onChange={handleChange} >
                                        <option value="tester" >Tester</option>
                                        <option value="coder">Coder</option>
                                    </select>
                                </div>
                                {data.role === 'coder' ? <div className="w-50">
                                    <label>Over time hour</label>
                                    <input type="number" className="form-control" name="numOfOvtHours"
                                        value={data.numOfOvtHours}
                                        onChange={handleChange}
                                    />

                                </div> : <div className="w-50">
                                    <label>Errors number</label>
                                    <input type="number" className="form-control" name="numOfErrors"
                                        value={data.numOfErrors}
                                        onChange={handleChange}
                                    />
                                </div>}
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <button className="btn btn-primary mt-4" onClick={handleAdd}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal visible={isUpdate} setModal={setIsUpdate}>
                <div className="container " style={{ width: '45vw', height: 'fit-content', backgroundColor: 'white', padding: '16px' }}>
                    <h2 className="text-center">Edit Employee </h2>
                    <div className="container mt-4 " style={{ width: '100%' }}>
                        <form ref={formEdit}>
                            <div className="form-group d-flex " >
                                <div style={{ width: '260px', height: '260px', border: '1px solid #ccc', marginRight: '16px' }}>
                                    <img src={data.avatar.includes('data:image') ? data.avatar : `http://localhost:8088/api/employees/images/${data.avatar}`} alt="avt" style={{ width: '258px', height: '258px', border: '1px solid #ccc' }} />
                                    {errInput.file && <p style={{ color: 'red', fontSize: '14px', marginTop:'2px' }}>{errInput.file}</p>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column-reverse', marginRight: '60px', marginLeft: '10px' }}>
                                    <label htmlFor="file" style={{ backgroundColor: 'rgb(87, 243, 69)', height: '30px', width: '30px', borderRadius: '12px', color: 'black', alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><MdFileOpen /></label>
                                    <input type="file" style={{ display: 'none' }} id="file" onChange={handleImageChange}></input>
                                </div>
                                <div className="form-group w-75" >
                                    <label>Employee Name</label>
                                    <input type="text" name="name" className="form-control"
                                        value={data.name} rules="required"
                                        onChange={handleChange} />
                                    {errInput.name && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.name}</p>}
                                    <label>Phone</label>
                                    <input type="text" name="phone" className="form-control"
                                        value={data.phone} rules="required"
                                        onChange={handleChange} />
                                    {errInput.phone && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.phone}</p>}
                                    <label>Dob</label>
                                    <input type="datetime-local" name="dob" className="form-control"
                                        value={data.dob} rules="required"
                                        onChange={handleChange} />
                                    {errInput.dob && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.dob}</p>}

                                </div>

                            </div>
                            <div className="form-group d-flex mt-4">
                                <div className="w-50 " style={{ marginRight: '20px' }}>
                                    <label>Email</label>
                                    <input type="email" name="email" className="form-control"
                                        value={data.email} rules="required"
                                        onChange={handleChange}
                                    />
                                    {errInput.email && <p style={{ color: 'red', fontSize: '14px' }}>{errInput.email}</p>}

                                </div>
                                <div className="w-50">
                                    <label>Base salary</label>
                                    <input type="number" name="baseSalary" className="form-control"
                                        value={data.baseSalary} rules="required"
                                        onChange={handleChange}
                                    />

                                </div>
                            </div>

                            <div className="form-group d-flex mt-4">
                                <div className="w-50 " style={{ marginRight: '20px', display: 'flex', flexDirection: 'column' }}>
                                    <label>Role</label>
                                    <select value={data.role} className="form-select" name="role" onChange={handleChange} >
                                        <option value="tester" >Tester</option>
                                        <option value="coder">Coder</option>
                                    </select>
                                </div>
                                {data.role === 'coder' ? <div className="w-50">
                                    <label>Over time hour</label>
                                    <input type="number" className="form-control" name="numOfOvtHours"
                                        value={data.numOfOvtHours}
                                        onChange={handleChange}
                                    />

                                </div> : <div className="w-50">
                                    <label>Errors number</label>
                                    <input type="number" className="form-control" name="numOfErrors"
                                        value={data.numOfErrors}
                                        onChange={handleChange}
                                    />

                                </div>}
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <button className="btn btn-primary mt-4" onClick={(e) => handleUpdate(e)}>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
            <ToastContainer position="top-right" autoClose={5000}
                hideProgressBar={false} newestOnTop={false} closeOnClick
                rtl={false} pauseOnFocusLoss draggable pauseOnHover
            />
        </div>
    );
}

export default ListEmployeeComponent;