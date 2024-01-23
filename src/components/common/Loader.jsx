"use client";

import React from "react";

export default function Loader({roleName}) {
    return (
        <div className="col-start-1 col-end-11 p-3 rounded-lg">
            <div className="flex flex-row items-center">
                <div
                    className="flex items-center justify-center h-10 w-30 rounded-full bg-purple-500 flex-shrink-0"
                >
                    {roleName}
                </div>
                <div className="relative ml-3 text-sm bg-white py-3 px-4 shadow rounded-xl rounded-br-xl">
                    <div role="status">
                         <div className="bouncing-loader">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};