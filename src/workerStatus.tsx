
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import React = require('react');

export function WorkStatusView() {
    const [workStatus, setWorkStatus] = useState(null);
    const onClick = async () => {
        const res = await fetch('/workStatus');
        setWorkStatus(res.json());
    };

    return (
        <div>
            <Button type="primary"  onClick={onClick}/>
            <div> {workStatus} </div>
        </div>
    );
}