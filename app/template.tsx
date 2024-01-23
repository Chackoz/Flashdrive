import React, { ReactNode } from "react";
import Layout from "./components/Layout";


interface RootTemplateProps {
  children: ReactNode;
}

const RootTemplate: React.FC<RootTemplateProps> = ({ children }) => (
<Layout>{children}</Layout>
);

export default RootTemplate;
