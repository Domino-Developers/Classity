import { useLocation, useHistory } from 'react-router-dom';

export const useQuery = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    return [query, location];
};

export const useEdit = () => {
    const [query, location] = useQuery();
    const history = useHistory();

    const editing = query.get('edit') === 'true';
    const edit = e => {
        if (e) history.replace(`${location.pathname}?edit=true`);
        else history.replace(`${location.pathname}`);
    };

    return [editing, edit];
};
