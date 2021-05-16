import { CContainer } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QTable from 'src/components/table/Table';
import { FILTER_OPERATOR, PAGE_SIZES, PERMISSION, ROUTE_PATH } from 'src/constants/key';
import Page404 from 'src/pages/page404/Page404';
import { deleteHoliday, fetchHolidays } from 'src/stores/actions/holiday';

const HolidayPage = ({ t, location, history }) => {
  // const columnDefOfRequestSetting = [
  //   { name: 'type', title: t('label.proposal_type') },
  //   { name: 'amount', title: t('label.maximum_day_amount') },
  // ];
  const permissionIds = JSON.parse(localStorage.getItem('permissionIds'));

  const columnDef = [
    { name: 'code', title: t('label.holiday_code'), align: 'left', width: '20%', wordWrapEnabled: true },
    { name: 'title', title: t('label.holiday_title'), align: 'left', width: '30%', wordWrapEnabled: true },
    { name: 'startDate', title: t('label.start_date'), align: 'left', width: '20%', wordWrapEnabled: true },
    { name: 'endDate', title: t('label.end_date'), align: 'left', width: '20%', wordWrapEnabled: true },
    //{ name: 'coefficient', title: 'Hệ số giờ làm' },
  ];
  const filters = {
    code: {
      title: t('label.holiday_code'),
      operates: [
        {
          id: FILTER_OPERATOR.LIKE,
          name: t('filter_operator.like'),
        },
      ],
      type: 'text',
    },
    title: {
      title: t('label.holiday_title'),
      operates: [
        {
          id: FILTER_OPERATOR.LIKE,
          name: t('filter_operator.like'),
        },
      ],
      type: 'text',
    },
  };
  const dispatch = useDispatch();
  const holidays = useSelector((state) => state.holiday.holidays);
  const [paging, setPaging] = useState({
    currentPage: 0,
    pageSize: PAGE_SIZES.LEVEL_1,
    total: 0,
    pageSizes: [PAGE_SIZES.LEVEL_1, PAGE_SIZES.LEVEL_2, PAGE_SIZES.LEVEL_3],
    loading: false,
  });
  const onCurrentPageChange = (pageNumber) =>
    setPaging((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));
  const onPageSizeChange = (newPageSize) =>
    setPaging((prevState) => ({
      ...prevState,
      pageSize: newPageSize,
    }));
  const onTotalChange = (total) =>
    setPaging((prevState) => ({
      ...prevState,
      total: total,
    }));
  const setLoading = (isLoading) => {
    setPaging((prevState) => ({
      ...prevState,
      loading: isLoading,
    }));
  };
  useEffect(() => {
    if (permissionIds.includes(PERMISSION.LIST_HOLIDAY)) {
      dispatch(
        fetchHolidays(
          {
            page: paging.currentPage,
            perpage: paging.pageSize,
          },
          onTotalChange,
          setLoading,
        ),
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paging.currentPage, paging.pageSize]);

  const filterFunction = (params) => {
    dispatch(
      fetchHolidays(
        {
          ...params,
          page: paging.currentPage,
          perpage: paging.pageSize,
        },
        onTotalChange,
        setLoading,
      ),
    );
  };

  const deleteRow = async (rowId) => {
    dispatch(deleteHoliday(rowId, t('message.successful_delete')));
    dispatch(
      fetchHolidays(
        {
          page: paging.currentPage,
          perpage: paging.pageSize,
        },
        onTotalChange,
        setLoading,
      ),
    );
  };
  if (permissionIds.includes(PERMISSION.LIST_HOLIDAY))
    return (
      <CContainer fluid className="c-main mb-3 px-4">
        <QTable
          t={t}
          columnDef={columnDef}
          data={holidays}
          route={ROUTE_PATH.HOLIDAY + '/tab1.id='}
          idxColumnsFilter={[1]}
          dateCols={[3, 2]}
          deleteRow={deleteRow}
          paging={paging}
          onCurrentPageChange={onCurrentPageChange}
          onPageSizeChange={onPageSizeChange}
          disableDelete={!permissionIds.includes(PERMISSION.DELETE_HOLIDAY)}
          disableCreate={!permissionIds.includes(PERMISSION.CREATE_HOLIDAY)}
          disableEdit={!permissionIds.includes(PERMISSION.GET_HOLIDAY)}
          filters={filters}
          filterFunction={filterFunction}
        />
      </CContainer>
    );
  else return <Page404 />;
};
export default HolidayPage;
