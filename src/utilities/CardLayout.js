const ReportLayout = ({ title, children, maxWidth = "100%", center = false }) => {
    const containerClasses = ["container-fluid", "mt-4"];
    let cardWrapperClasses = ["card", "shadow-sm", "mb-4"];

    if (center) {

        cardWrapperClasses = [...cardWrapperClasses, "mx-auto"];
    }

    return (
        <section>
            <main>
                <section className="">
                    <div className={containerClasses.join(" ")}>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                            <h5>{title}</h5>
                        </div>


                        <div className={cardWrapperClasses.join(" ")} style={{ maxWidth: maxWidth }}>
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