import { useEffect } from 'react';

function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} — FlowState`;
  }, [title]);
}

export default usePageTitle;
