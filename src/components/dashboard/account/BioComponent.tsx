import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MAX_LENGTH = 500; // กำหนดความยาวสูงสุดที่จะแสดง

const BioComponent: React.FC<{ bio: string }> = ({ bio }) => {
  const [showFullBio, setShowFullBio] = useState(false);

  const toggleShowBio = () => {
    setShowFullBio(!showFullBio);
  };

  return (
    <div>
      <Typography variant="body2">
        {showFullBio || bio.length <= MAX_LENGTH
          ? bio
          : `${bio.slice(0, MAX_LENGTH)}...`}
      </Typography>
      {bio.length > MAX_LENGTH && (
        <Button onClick={toggleShowBio}>
          {showFullBio ? 'ดูน้อยลง' : 'ดูเพิ่มเติม'}
        </Button>
      )}
    </div>
  );
};

export default BioComponent;
