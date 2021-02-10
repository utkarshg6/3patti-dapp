import React from 'react';
import { Menu } from 'semantic-ui-react';

export default () => {
    return (
        <Menu>
            <Menu.Item>
                Play Teen Patti
            </Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item>
                    Games
                </Menu.Item>
                <Menu.Item>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}