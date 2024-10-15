import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { infoBulletin } from "../../slices/infoBulletinSlice";

const InformationBulletin = () => {
  const infoBulletinData = useSelector(
    (state) => state.infoBulletinReducer.infoBulletin?.data
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!infoBulletinData) dispatch(infoBulletin());
  }, []);
  return (
    <>
      <h5 className="mb-5">Information Bulletin</h5>
      <table className="table table-striped table-bordered">
        <thead>
          <th>Topic</th>
          <th>Description</th>
          <th>Action</th>
        </thead>
        <tbody>
          {infoBulletinData?.map((data) => (
            <tr>
              <td>{data.topic}</td>
              <td>{data.description}</td>
              <td>
                <a
                  href={data.url}
                  target="blank"
                  className="btn btn-sm cob-btn-primary text-white"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default InformationBulletin;
