import React from 'react'
import { Button } from 'semantic-ui-react';

const DonateButton = () => {
    return (
        <div className='donateButton'>
            <Button color='blue' size='massive'>
                Donate Now!
            </Button>
        </div>
    );
}

export default DonateButton