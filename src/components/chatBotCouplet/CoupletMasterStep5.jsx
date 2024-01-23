"use client";

import React, { useState, useEffect } from "react";
import CoupletWidget from "./CoupletWidget";
export default function CoupletMasterStep5(props) {

    const [chunlian, setChunlian] = useState({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" });

    useEffect(() => {
        console.log(props.attempts);
        console.log(props.chunlians);
        setChunlian(props.chunlians[props.attempts - 1][props.selection - 1]);

        const timeoutId = setTimeout(() => {
            window.location.reload();
        }, '15000');
        return () => clearTimeout(timeoutId);

    }, [props]);

    return <CoupletWidget coupletTop={chunlian.hengpi} coupletLeft={chunlian.shanglian} coupletRight={chunlian.xialian} paddingBottom='350px'/>;
}
