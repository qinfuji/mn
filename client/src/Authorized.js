import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import {Redirect} from 'react-router-dom';
import {getAuthority} from './utils/authority';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({children}) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
