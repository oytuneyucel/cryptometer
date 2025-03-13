import React, { useEffect  } from 'react';

interface Props {
    adClient: string
     adSlot: string
      adFormat: string
}
const AdsComponent = ({adClient, adSlot, adFormat}: Props) => {


    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }

        catch (e) {

        }

    },[]);



    return (
        <>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true">
            </ins>
        </>
    );
};

export default AdsComponent;