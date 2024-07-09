import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApi, postApi } from './Helper/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Pagination from './Pagiantion';

function App() {
  const [show, setShow] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState('');
  const [searchName, setSearchName] = useState('');
  const [count, setCount] = useState(0);
  const[id,setId]=useState()
  const [initialValues, setInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    country: '',
    address: '',
    birthdate: '',
    gender: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState('');
  console.log("🚀 ~ App ~ initialValues:", initialValues)
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false);
    setInitialValues({
      
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      country: '',
      address: '',
      birthdate: '',
      gender: '',
      image: null,
    });
    setPreviewImage('');
  };
  /*************Pagination */
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageChange = (pageNumber) => {   
    setCurrentPage(pageNumber);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues:initialValues,
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      country: Yup.string().required('Country Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      mobile_number: Yup.string().required('Mobile number is required'),
      address: Yup.string().required('Address is required'),
      birthdate: Yup.date().required('Birthdate is required'),
      gender: Yup.string().required('Gender is required'),
      image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File size is too large', (value) => value && value.size <= 1024 * 1024) // 1 MB
        .test('fileFormat', 'Unsupported file format', (value) =>
          value && ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type)
        ),
    }),
    onSubmit: async (values) => {
      try {
        const url = isUpdate ? `update-user/${id}` : 'add-user';
        const res = await postApi(url, values, true);
        if (res.status === 200) {
          handleClose();
          successNotify(res.message);
          formik.resetForm();  
          fetchUsers();                 
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
  const fetchUsers = async () => {
    try {
      let url = 'user';

      // Check if genderFilter is not null or undefined
      if (genderFilter) {
        url += `?gender=${genderFilter}`;
      }

      // Check if searchName is not null or undefined
      if (searchName) {
        url += `${genderFilter ? '&' : '?'}search=${searchName}`;
      }

      const response = await getApi(url);
      console.log("🚀 ~ fetchUsers ~ response:", response)
      setCount(response.count)
      setUsers(response.data);
      setTotalPages(response.totalPages)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [searchName, genderFilter, currentPage]);
  const getUpdateUser = async (id) => {        
    await getApi(`get-update-user/${id}`).then((res) => {
      console.log("🚀 ~ awaitgetApi ~ res:", res)
      if (res.status === 200) {
        console.log("🚀 ~ awaitgetApi ~ res:", res)
        setInitialValues(res.data);  
        setPreviewImage(`${process.env.REACT_APP_UPLOADS_URL}images/${res?.data?.image}`)      
        handleShow();
        fetchUsers();
      }
    });
  };
  const deleteUser = async (id) => {
    await getApi(`delete-user/${id}`).then((res) => {     
      if (res.status === 200) {
        successNotify(res.message)        
        fetchUsers();
      }
    });
  };
  const successNotify = (message) => {
    toast.success({
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      message,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('image', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <Container>
        <div className="d-flex gap-4 justify-content-end items-align-center mt-3 mb-3">
          <div>
            <Form.Control
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div>
            <Form.Control
              as="select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </div>
          <div>
            <Button variant="primary" onClick={handleShow}>
              Add User
            </Button>
          </div>
        </div>

        <Table striped hover>
          <thead>
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Country</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="align-middle text-center">
                <td colSpan="11">No Record Found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="align-middle">
                  <td>
                    {user.image ? (
                      <div className="image-wrap image-wrap-icon">
                        <img
                          src={`${process.env.REACT_APP_UPLOADS_URL}images/${user?.image}`}
                          alt={user?.first_name}
                        />
                      </div>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{user?.first_name}</td>
                  <td>{user?.last_name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.mobile_number}</td>
                  <td>{user?.address}</td>
                  <td>{user?.country}</td>
                  <td>{user?.birthdate}</td>
                  <td>{user?.gender}</td>
                  <td>{user?.age}</td>
                  <td>
                    <div className="d-flex gap-4 white">
                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          setId(user.id);
                          setIsUpdate(true);                          
                          getUpdateUser(user.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="22"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentcolor"
                            d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                          />
                        </svg>
                      </button>
                      <button className="btn btn-danger" onClick={()=>
                        deleteUser(user.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="22"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fill="currentcolor"
                            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {count > 0 ? <h6>{count} Records</h6> : null}
        {totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            handlePageChange={handlePageChange}
          />
        ) : null}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isUpdate ? "Update User" : "Add User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="6">
                  <Form.Group controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.first_name}
                      isInvalid={formik.touched.first_name && formik.errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.last_name}
                      isInvalid={formik.touched.last_name && formik.errors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      isInvalid={formik.touched.email && formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group controlId="mobile_number">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile_number}
                      isInvalid={formik.touched.mobile_number && formik.errors.mobile_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.mobile_number}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group controlId="birthdate">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthdate"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.birthdate}
                      isInvalid={formik.touched.birthdate && formik.errors.birthdate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.birthdate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.gender}
                      isInvalid={formik.touched.gender && formik.errors.gender}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.gender}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      as="select"
                      name="country"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      isInvalid={formik.touched.country && formik.errors.country}
                    >
                      <option value="">Select Country</option>
                      <option value="india">India</option>
                      <option value="canada">Canada</option>
                      <option value="us">US</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      isInvalid={formik.touched.address && formik.errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <Form.Group controlId="image">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.image && formik.errors.image}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.image}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {previewImage && (
                    <div className='image-wrap mt-2'><img src={previewImage} alt="Preview" className="fluid" style={{ maxHeight: '200px' }} /></div>
                  )}
                </Col>
              </Row>

              <Button type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default App;
