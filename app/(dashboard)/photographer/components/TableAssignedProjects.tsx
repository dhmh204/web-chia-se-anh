import Table from '@/components/Table'
import Badge from '@/components/Badge';
import React from 'react'
import Button from '@/components/Button';
 
type props = {
  isDetails?: boolean
}




const TableAssignedProjects = ({ isDetails = false }: props) => {
const headers = ["Dự án", "ALbum", "Ảnh", "Phản hồi", "Trạng thái", isDetails ? "Thao tác" : ""];

  return (
    <Table headers={headers} >
       <tr>
         <td>
            Kỷ yếu 
        </td>
       <td>
            2 album
        </td>
          <td>
            248
        </td>
       <td>
           15
        </td>
          <td>
           <Badge variant="editing" label="Đang sửa" />
        </td>
       {
          isDetails && (
            <td>
              <Button href="/" variant="sm">
                Album
              </Button>
               <Button href="/" variant="sm">
                Chi tiết
              </Button>
            </td>
          )
        }
       </tr>
        </Table>
  )
}

export default TableAssignedProjects
