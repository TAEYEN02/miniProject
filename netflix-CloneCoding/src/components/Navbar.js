import styled from "styled-components";
const Navbar = () => {
    return(
        <Container>
            <Logo>Netflix</Logo>
            <ul>
                <li>홈</li>
                <li>시리즈</li>
                <li>영화</li>
                <li>게임</li>
                <li>NEW! 요즘 대세 콘텐츠</li>
                <li>내가 찜한 리스트</li>
                <li>언어별로 찾아보기</li>
            </ul>
            <SearchInput type="text" placeholder="Search"/>
        </Container>
    );
}
export default Navbar;

const Container = styled.header`
    display : flex;
    justify-content : space-between;
    aligin-items : center;
    background-color : black;
    color : white;
    position : fixed;
    width : 100%;
    top : 0;
    z-index : 100;
`;
const Logo = styled.h1`
    font-weight : bold;
`;

const SearchInput = styled.input`
    padding : 5px 10px;
    board-radius: 4px;
    boarder : none;
`;

const ListContainer = styled.ul`
    
`;