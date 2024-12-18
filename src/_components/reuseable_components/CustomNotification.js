function CustomNotification({ message, ctaName, ctaHandler }) {

    const btnHandler = () => {
        ctaHandler()
    }

    return (
        <div className="row">
            <div
                className="alert important-notification d-flex justify-content-between p-2"
                role="alert"
            >
                <p className="m-0">
                    <i className="fa fa-warning" /> {message}
                </p>
                <button
                    className="btn btn-sm cob-btn-primary p-1"
                    disabled={false}
                    onClick={() => btnHandler()}
                >
                    {ctaName}
                </button>
            </div>
        </div>
    )
}

export default CustomNotification