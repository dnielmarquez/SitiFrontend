import { useNavigate } from "react-router";

export const useAppNavigation = () => {
    const navigate = useNavigate();

    const goToPage = (path: string) => {
        navigate(path);
    }
    return { goToPage };
};
