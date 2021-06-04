import { FC } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import loadable from "@loadable/component";
import Loading from "components/Loading/Loading";

const RouterList = [
  {
    component: () => import(""),
    path: "/total_statistic",
  },
];

const RouteIndex: FC = () => {
  return (
    <Router>
      <Switch>
        {RouterList.map((item) => (
          <Route
            key={item.path}
            exact={item.path === "/cubes" ? true : false}
            path={item.path}
            component={loadable<any>(item.component, {
              fallback: <Loading />,
            })}
          />
        ))}
      </Switch>
    </Router>
  );
};

export default RouteIndex;
