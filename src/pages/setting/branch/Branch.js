import { CContainer } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BasicLoader from "src/components/loader/BasicLoader";
import QTable from "src/components/table/Table";
import { changeListButtonHeader } from "src/stores/actions/header";

// shortname, name, startCC, endCC, coefficient
const columnDef = [
  { name: "branchCode", title: "Mã chi nhánh" },
  { name: "branchName", title: "Tên chi nhánh" },
  { name: "address", title: "Địa chỉ" },
];

const data = [
  {
    id: 1,
    branchCode: "APPHRTD",
    branchName: "APPHR Thủ Đức",
    address: "Tầng 5 Vincom Thủ Đức, Quận Thủ Đức, Thành phố Hồ Chí Minh ",
  },
  {
    id: 2,
    branchCode: "APPHRQ1",
    branchName: "APPHR Quận 1",
    address: "Tầng 5 Vincom Quận 1, Quận 1, Thành phố Hồ Chí Minh ",
  },
  {
    id: 3,
    branchCode: "APPHRQ2",
    branchName: "APPHR Quận 2",
    address: "Tầng 5 Vincom Quận 2, Quận 2, Thành phố Hồ Chí Minh ",
  },
  {
    id: 4,
    branchCode: "APPHRQ3",
    branchName: "APPHR Quận 3",
    address: "Tầng 5 Vincom Quận 3, Quận 3, Thành phố Hồ Chí Minh ",
  },
  {
    id: 5,
    branchCode: "APPHRQ4",
    branchName: "APPHR Quận 4",
    address: "Tầng 5 Vincom Quận 4, Quận 4, Thành phố Hồ Chí Minh ",
  },
  {
    id: 6,
    branchCode: "APPHRQ5",
    branchName: "APPHR Quận 5",
    address: "Tầng 5 Vincom Quận 5, Quận 5, Thành phố Hồ Chí Minh ",
  },
  {
    id: 7,
    branchCode: "APPHRQ6",
    branchName: "APPHR Quận 6",
    address: "Tầng 5 Vincom Quận 6, Quận 6, Thành phố Hồ Chí Minh ",
  },
];

const Branch = ({ t, location }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let wait = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    wait();
    dispatch(
      changeListButtonHeader([
        <Link
          to={"/setting/branch/newBranch"}
          className="btn btn-primary"
          key="newBranch"
        >
          Tạo chi nhánh
        </Link>,
      ])
    );
    return () => {
      dispatch(changeListButtonHeader([]));
      clearTimeout(wait);
    };
  }, []);

  return (
    <CContainer fluid className="c-main mb-3 px-4">
      {isLoading ? (
        <BasicLoader isVisible={isLoading} radius={10} />
      ) : (
        <QTable
          columnDef={columnDef}
          data={data}
          route={"/setting/branch"}
          idxColumnsFilter={[0, 1]}
        />
      )}
    </CContainer>
  );
};
export default Branch;
