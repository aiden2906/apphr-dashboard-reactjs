import {
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BasicLoader from "src/components/loader/BasicLoader";
import QTable from "src/components/table/Table";
import { changeListButtonHeader } from "src/stores/actions/header";

const columnDefOfRequestSetting = [
  { name: "type", title: "Loại đề xuất" },
  { name: "total", title: "Số ngày tối đa" },
];

const dataOfRequestSetting = [
  {
    id: 1,
    type: "Nghỉ có phép",
    total: "12",
  },
  {
    id: 2,
    type: "Nghỉ không phép",
    total: "2",
  },
  {
    id: 3,
    type: "Nghỉ chế độ",
    total: "60",
  },
  {
    id: 4,
    type: "Xin làm thêm",
    total: "5",
  },
];
const columnDef = [
  { name: "title", title: "Tiêu đề" },
  { name: "start", title: "Ngày bắt đầu" },
  { name: "end", title: "Ngày kế thúc" },
  { name: "coefficient", title: "Hệ số giờ làm" },
];

const data = [
  {
    id: 1,
    title: "Tết Dương lịch",
    start: "1/1/2021",
    end: "1/1/2021",
    coefficient: 2,
  },
  {
    id: 2,
    title: "Tết Âm lịch",
    start: "31/1/2021",
    end: "23/2/2021",
    coefficient: 2,
  },
  {
    id: 3,
    title: "Giổ tổ Hùng Vương",
    start: "30/3/2021",
    end: "30/3/2021",
    coefficient: 2,
  },
  {
    id: 4,
    title: "Ngày giải phóng miền Nam thống nhất Đất Nước",
    start: "30/4/2021",
    end: "30/4/2021",
    coefficient: 2,
  },
  {
    id: 5,
    title: "Ngày quốc tế lao động",
    start: "1/5/2021",
    end: "1/5/2021",
    coefficient: 2,
  },
  {
    id: 6,
    title: "Ngày quốc tế thiếu nhi",
    start: "1/6/2021",
    end: "1/6/2021",
    coefficient: 2,
  },
];

const HolidayPage = ({ t, location }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isDefaultTab, setIsDefaultTab] = useState(true);

  useEffect(() => {
    let wait = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    wait();
    if (isDefaultTab)
      dispatch(
        changeListButtonHeader([
          <Link
            to={"/setting/holiday/newHoliday"}
            className="btn btn-primary"
            key="newHoliday"
          >
            Tạo ngày nghỉ lễ
          </Link>,
        ])
      );
    else
      dispatch(
        changeListButtonHeader([
          <Link
            to={"/setting/holiday/newHoliday"}
            className="btn btn-primary"
            key="newHoliday"
          >
            Cập nhật
          </Link>,
        ])
      );
    return () => {
      dispatch(changeListButtonHeader([]));
      clearTimeout(wait);
    };
  }, [isDefaultTab]);

  const handleChangeTab = (e) => {
    setIsDefaultTab(e === "holiday");
    setIsLoading(true);
  };

  return (
    <CContainer fluid className="c-main mb-3 px-4">
      <CTabs activeTab="holiday" onActiveTabChange={handleChangeTab}>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink data-tab="holiday">Ngày nghỉ lễ</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink data-tab="holidaySettings">
              Thiết lập số ngày nghỉ
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane data-tab="holiday">
            {isLoading ? (
              <BasicLoader isVisible={isLoading} radius={10} />
            ) : (
              <QTable
                columnDef={columnDef}
                data={data}
                route={"/setting/holiday"}
                idxColumnsFilter={[0]}
              />
            )}
          </CTabPane>
          <CTabPane data-tab="holidaySettings">
            {isLoading ? (
              <BasicLoader isVisible={isLoading} radius={10} />
            ) : (
              <QTable
                columnDef={columnDefOfRequestSetting}
                data={dataOfRequestSetting}
                route={"/setting/holiday"}
                idxColumnsFilter={[0]}
              />
            )}
          </CTabPane>
        </CTabContent>
      </CTabs>
    </CContainer>
  );
};
export default HolidayPage;
