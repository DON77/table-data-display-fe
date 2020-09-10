import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { api_url } from '../config/api';
import Arrow from '../image/down-arrow.png';
import logo from '../logo.svg';

import './Table.scss';

function Table() {
    const [tableData, setTableData] = useState(null);
    const [loading, setLoadin] = useState(false);
    const [pageValue, setPageValue] = useState('');
    const [limitValue, setLimitValue] = useState('');
 
    const toggleFilter = (event) => {
        const value = event.currentTarget.id;
        const key = event.target.name;
        getData({
            'order_by': key,
            'order_direction': value
        });
    };

    const getData = async (params) => {
        setLoadin(true);
        params = {...{
            'limit': tableData.limit,
            'page': tableData.current_page,
            'order_by': tableData.order_by,
            'order_direction': tableData.order_direction
        }, ...params};
        axios.get(api_url, {params})
        .then(res => {
            let persons = res.data;
            setTableData(persons);
            setLoadin(false);
            setPageValue(persons.current_page);
            setLimitValue(persons.limit);
        });
    }

    const handleSelectLimit = async (event) => {
        await getData({'limit': event.target.value});
    }

    const handleSetPage = async (event) => {
        const value = event.target.value || event.target.dataset.pagenumber;
        await getData({'page': value});
    }

    const isOrderedBy = (field) => {
        return tableData.order_by === field;
    }

    const getNextDirection = (field) => {
        if (isOrderedBy(field)) {
            return tableData.order_direction === 'asc'? 'desc' : 'asc';
        }
        return 'asc';
    }

    const getHeaderClassname = (field) => {
        return isOrderedBy(field)? `${tableData.order_direction} active` : 'asc';
    }

    useEffect(() => {
        axios.get(api_url)
            .then(res => {
                let persons = res.data;
                setTableData(persons);
                setPageValue(persons.current_page);
                setLimitValue(persons.limit);
            });
    }, []);

    return (
        <>
            {
                tableData ? ( 
                    <div className="container">
                    <div className={`${!loading && 'd-none'} loading-spinner`}>
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                    <table className="JStable">
                        <thead className="JStable-head">
                            <tr>
                                <th>
                                    <span>
                                    ID
                                    <img 
                                        src={Arrow} 
                                        alt="Logo" 
                                        className={ getHeaderClassname('id') }
                                        id={ getNextDirection('id') }
                                        onClick={toggleFilter} 
                                        name="id"
                                    />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                    Name
                                    <img 
                                        src={Arrow} 
                                        alt="Logo" 
                                        className={ getHeaderClassname('name') }
                                        id={ getNextDirection('name') }
                                        onClick={toggleFilter} 
                                        name="name"
                                    />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                    Salary
                                    <img 
                                        src={Arrow} 
                                        alt="Logo" 
                                        className={ getHeaderClassname('salary') }
                                        id={ getNextDirection('salary') }
                                        onClick={toggleFilter} 
                                        name="salary"
                                    />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                    Email
                                    <img 
                                        src={Arrow} 
                                        alt="Logo" 
                                        className={ getHeaderClassname('email') }
                                        id={ getNextDirection('email')}
                                        onClick={toggleFilter} 
                                        name="email"
                                    />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        Created At
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="JStable-body">
                            {
                                tableData && tableData.data.map((item) => (
                                    <tr key={item.id}>  
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.salary}</td>
                                        <td>{item.email}</td>
                                        <td>{item.created_at}</td>
                                    </tr>
                                ))
                            }
                            {
                                !tableData.data.length && 
                                    <tr className="no-data">
                                        <td>
                                            <p>No data</p>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                        <tfoot className="JStable-foot">
                            <tr>
                                <td></td>   
                                <td></td>   
                                <td></td>   
                                <td className="per_page">
                                    <span>
                                        Rows per page:
                                    </span>
                                    <input type="text" onBlur={handleSelectLimit} 
                                        value={limitValue} 
                                        onChange={(e) => setLimitValue(e.target.value)}
                                    />
                                    <div>
                                        <span className="from">1</span>
                                        <span className="to">15</span>
                                        <span className="to">of 200</span>
                                    </div>
                                </td>
                                <td className="next_prev">
                                    <img 
                                        src={Arrow} 
                                        alt="Logo"
                                        data-pagenumber={tableData.current_page - 1}
                                        className={
                                            `${!tableData.prev_page_url && 'disabled'} prev`
                                        } 
                                        onClick={handleSetPage} 
                                        name="prev"
                                    />
                                    <input 
                                        type="text" 
                                        onBlur={handleSetPage} 
                                        value={pageValue} 
                                        onChange={(e) => setPageValue(e.target.value)} />
                                    <img 
                                        src={Arrow} 
                                        alt="Logo"
                                        data-pagenumber={tableData.current_page + 1}
                                        className={
                                            `${!tableData.next_page_url && 'disabled'} next`
                                        } 
                                        onClick={handleSetPage} 
                                        name="next"
                                    />
                                </td>   
                            </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <div className='loading-spinner'>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            )  
        }

       </>
    )
}

export default Table
