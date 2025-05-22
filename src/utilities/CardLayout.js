const ReportLayout = ({ title, children }) => {
    return (
        <section >
            <main >

                <section className="">
                    <div className="container-fluid mt-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                            <h5>{title}</h5>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>

    );
};

export default ReportLayout;
