import Card from '@mui/material/Card';
import { CardHeader } from '@mui/material';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <h1>Export formatted text to PDF</h1>
        </header>
    )
}

// const Header = () => {
//     return (
//         <Card sx={{ minHeight: 80 }}>
//             <CardHeader className="app-header">
//                 <h1>Export formatted text to PDF</h1>
//             </CardHeader>
//         </Card>
//     )
// }

export default Header;