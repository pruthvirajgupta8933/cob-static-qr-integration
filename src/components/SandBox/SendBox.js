import React, { useEffect } from 'react'
import NavBar from '../dashboard/NavBar/NavBar'
import StepProgressBar from '../../_components/reuseable_components/StepProgressBar/StepProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { kycUserList } from '../../slices/kycSlice';




function Sandbox() {

    const { auth, kyc } = useSelector((state) => state);
    const { user } = auth;
    const kycStatus = kyc?.kycUserList?.status




    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(kycUserList({ login_id: user?.loginId }));
    }, [user]);

    return (
        <section className="ant-layout Satoshi-Medium">
            <div>
                <NavBar />
            </div>
            <main className="gx-layout-content ant-layout-content">
                <div className="gx-main-content-wrapper">
                    <div className="right_layout my_account_wrapper right_side_heading">
                        <h1 className="m-b-sm gx-float-left">Sandbox</h1>
                    </div>
                    <section className="features8 cid-sg6XYTl25a flleft w-100">
                        <div className="container-fluid">

                        </div>
                    </section>

                    <section className="features8 cid-sg6XYTl25a flleft w-100">
                        <div className="container-fluid  p-3 my-3 ">

                            <StepProgressBar status={kycStatus} />
                            <div>

                            </div>
                            <div className="container">
                            <div className="col-lg-12 border m-2 p-2">
                            <a class="btn" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="true" aria-controls="multiCollapseExample1"><h2>Test Credentials </h2></a>
                            {/* <h2>Test Credentials</h2> */}
                                <form class="collapse multi-collapse show" id="multiCollapseExample1">
                                    <div className="form-group row">
                                        
                                        <div className="col-lg-4">
                                            <label htmlFor="inputEmail3" className="col-form-label">Client Code </label>
                                            <input type="text" className="form-control" id="inputEmail3" disabled="true" value="HUGZT" />
                                        </div>
                                        <div className="col-lg-4">
                                            <label htmlFor="inputPassword3" className="col-form-label">UserName </label>
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="bhabesh.jha_4757" />
                                        </div>
                                        <div className="col-lg-4">
                                            <label htmlFor="inputEmail3" className="col-form-label">Password </label>
                                            <input type="text" className="form-control" id="inputEmail3" disabled="true" value="HUGZT_SP4757" />
                                        </div>
                                        <div className="col-lg-4">
                                            <label htmlFor="inputPassword3" className="col-form-label">Authentication Key </label>
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="wolF0anDeIin6Cdb" />
                                        </div>
                                        <div className="col-lg-4">
                                            <label htmlFor="inputPassword3" className="col-form-label">Authentication IV </label>
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="v86CWyr6c7LPWSXQ" />
                                        </div>
                                        <div className="col-lg-4">
                                            <label htmlFor="inputPassword3" className="col-form-label">Environment Base URL </label>
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="https://sandbox.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" />
                                        </div>
                                    </div>
                                    
                                   

                                </form>

                            </div>

                            <div className="col-lg-12 border m-2 p-2">
                            <a class="btn" data-toggle="collapse" href="#multiCollapseExample2" role="button" aria-expanded="false" aria-controls="multiCollapseExample2"><h2>Live Credentials</h2></a>
                            {/* <h2>Live Credentials</h2> */}
                            <form class="collapse multi-collapse" id="multiCollapseExample2">
                                    <div className="form-group row">
                                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Client Code </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputEmail3" disabled="true" value="HUGZT" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">UserName </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="bhabesh.jha_4757" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Password </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputEmail3" disabled="true" value="HUGZT_SP4757" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Authentication Key </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="wolF0anDeIin6Cdb" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Authentication IV </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="v86CWyr6c7LPWSXQ" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Environment Base URL </label>
                                        <div className="col-sm-5">
                                            <input type="text" className="form-control" id="inputPassword3" disabled="true" value="https://sandbox.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" />
                                        </div>
                                    </div>

                                </form>

                            </div>
                           
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </section>
    )
}

export default Sandbox