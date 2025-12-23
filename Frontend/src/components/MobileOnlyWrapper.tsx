import React, { type FC, type ReactNode } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery'; // Assuming this is the correct path

// Define the component's props interface
interface MobileOnlyWrapperProps {
  children: ReactNode;
}

const TABLET_BREAKPOINT = '(min-width: 700px)';

const MobileOnlyWrapper: FC<MobileOnlyWrapperProps> = ({ children }) => {
  // The hook returns true if the screen is 1025px or wider (i.e., Desktop)
  const isDesktop = useMediaQuery(TABLET_BREAKPOINT);

  if (isDesktop) {
    // Render the restrictive message for desktop users
    return (
      <div
        style={styles.container}
        className="bg-gradient-to-b from-[#ff4d4d] via-[#ffe5e5] to-white"
      >
        <div style={styles.messageBox}>
          <h2 className="text-2xl font-semibold">Access Restricted 📵</h2>
          <p className="my-2">
            Swapo is designed for viewing on{' '}
            <span className="font-medium">mobile and tablet devices only.</span>
          </p>
          <p>Please switch to a smaller screen to continue.</p>
        </div>
      </div>
    );
  }

  // Render the actual application content for mobile and tablet users
  return <>{children}</>;
};

// Define a type for the styles object, using React.CSSProperties
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px',
  },
  messageBox: {
    maxWidth: '400px',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '20px',
  },
};

export default MobileOnlyWrapper;
