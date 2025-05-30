import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export default function CategoryTable({
  categories,
  selectedCategories,
  toggleCategorySelection,
  toggleAllCategories,
  onEditCategory,
  onDeleteCategory,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-toggle")
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const getParentName = (parentId) => {
    if (!parentId) return "-";
    const parent = categories.find((cat) => cat._id === parentId);
    return parent ? parent.name : "-";
  };

  return (
    <div className="rounded-md border overflow-auto h-[500px]">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="w-[50px] p-2 text-center">
              <input
                type="checkbox"
                checked={
                  selectedCategories.length === categories.length &&
                  categories.length > 0
                }
                onChange={toggleAllCategories}
              />
            </th>
            <th className="p-2">
              Tên danh mục <ArrowUpDown className="inline h-4 w-4 ml-1" />
            </th>
            <th className="p-2">Danh mục cha</th>
            <th className="w-[100px] p-2"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border-t">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => toggleCategorySelection(category._id)}
                />
              </td>
              <td className="p-2 text-center">{category.name}</td>
              <td className="p-2 text-center">
                {getParentName(category.parent)}
              </td>
              <td className="p-2 text-center relative">
                <button
                  className="p-1 hover:bg-gray-100 rounded-full dropdown-toggle"
                  onClick={() =>
                    setDropdownOpen(
                      dropdownOpen === category._id ? null : category._id
                    )
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {dropdownOpen === category._id && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 z-50 bg-white border rounded-md shadow-md"
                    ref={dropdownRef}
                  >
                    <div className="px-4 py-2 text-sm font-semibold">
                      Thao tác
                    </div>
                    <div
                      className="border-t px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        onEditCategory(category);
                        setDropdownOpen(null);
                      }}
                    >
                      Chỉnh sửa
                    </div>
                    <div
                      className="px-4 py-2 text-sm hover:bg-red-100 text-red-600 cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm("Bạn có chắc muốn xóa danh mục này?")
                        ) {
                          onDeleteCategory(category._id);
                        }
                        setDropdownOpen(null);
                      }}
                    >
                      Xóa
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
